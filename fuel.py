'''
this module calibrates a fuel tank for the fuel sensor
the module then stores the tank details in a global jfms data library
'''

false = False # just in case i forget I'm in Python and not C++

def read(pin=23, against=0):
    '''
    read the height(or volume?) value on the RPi sensor
    if `against` is given, then generate random numbers
    '''

    if against:
        return against - round(random.random(), 2)

def calibrate(*args, **kwargs): 
    '''
    Read height(x-data) data from the tank to be calibrated plus
        * either height(y-data) in standard tank OR
        * volume(y-data) of liquid flowing out of the subject tank
    
    This function does not distinguish between the two posible target readings ie
    `height in standard tank` or `volume of liquid flowing out of the subject tank`
    This is distinction is left to the interpolating function!
    
    The only precaution made is determining if the y-data is from an overflow or
    not(this is particularly true for the second type of y-data when the standard
    tank is smaller than the subject tank so it has to be emptied whenever its full
    before the operation can continue)
    
    return value is a tuple(or list) of 2-item tuples PLUS data_count ie the entries in the data set
    
    '''

    x_data_pin = kwargs.get('x-pin',10)
    y_data_pin = kwargs.get('y-pin',11)

    x_zero_tolerance = kwargs.get('x-zero-tolerance',0.5) # its hard to get the height to absolute 0 when draining the subject tank
    
    data_count = 0
    x,y = 1,0
    
    while (x-x_zero_tolerance)>0:
        x = read(x_data_pin)
        y = read(y_data_pin)
    
        data.append((x,y))
        
        data_count += 1

    return data, data_count

def _interpolate(p0,p1,p2, target_pos=1):
    '''
    p0,p1,p2: (x0,y0),(x1,y1),(x2,y2) 
    target_pos is the index of the point with the unknown y-value, default is the middle point
    
    this function ASSUMES THAT ALL POINTS ARE FLOATS
    '''
    
    target_pos = target_pos if 1<=target_pos<=3 else 1
    
    if target_pos==0:
        return p1[1] + ((p1[1]-p2[1])/(p1[0]-p2[0]))*(p0[0]-p1[0])
    elif target_pos==1:
        return p0[1] + ((p2[1]-p0[1])/(p2[0]-p0[0]))*(p1[0]-p0[0])
    else: # target_index = 2
        return p1[1] + ((p1[1]-p0[1])/(p1[0]-p0[0]))*(p2[0]-p1[0])
    

def get_actual_value(data, reading, data_count=0, tolerance=.001):
    '''
    data: return value of `calibrate`
    reading: float
    data_count: number of readings in the data. if 0, will be calculated with len(data)
                providing it would imporove on this functions efficiency
    tolerance: since we are dealing with floats, we cant exactly compare values
            directly so we need a tolerance such that 
                if x==y: ...
            becomes
                if abs(x-y)<=tolerance: ...
    
    function to use the calibrated data to interpolate a y-data value given an 
    x-data reading(that may or may not be in the calibrated data table)

    Because we are not sure that the x-data(height of liquid in subject tank) is
    sure to decline in well-defined steps, pinpointing the x-data value to use for
    the interpolation is near impossible so a binary search was prefered as the only
    guarantee we have is that the x-data is sorted

    NB: the most fundumental principle here is that the x-data is in DECENDING order
    '''

    if (abs(reading-data[0][0])<=tolerance) or (reading>data[0][0]): return data[0][1]
    if (abs(reading-data[-1][0])<=tolerance) or (reading<data[-1][0]): return data[-1][1]

    i = 1 # iterations to track out binary search. needed in debug mode
    
    data_count = data_count if data_count else len(data)
    pos, _pos = data_count/2, 0
    prev_pos = 0
    
    while 1:
        
        print "search={}, prev-pos={}, pos={}, vi={}".format(i,prev_pos,pos,data[pos][0])
        
        # this is not impossible given the large sample set
        if abs(reading-data[pos][0])<=tolerance: return data[pos][1]
        
        if not pos:
            return _interpolate(data[pos+1],(reading,-1),data[pos])
        elif pos==data_count-1:
            return _interpolate(data[pos],(reading,-1),data[pos-1])

        _pos = pos
        
        if reading>data[pos][0]:
            # search to the left
            if abs(reading-data[pos-1][0])<=tolerance: return data[pos-1][1]
            if reading<data[pos-1][0]:
                return _interpolate(data[pos],(reading,-1),data[pos-1])

            pos -= (pos-prev_pos)/2 if pos>prev_pos else (prev_pos-pos)/2

            if pos==_pos: pos -= 1
            
        else:
            # search to the right
            if abs(reading-data[pos+1][0])<=tolerance: return data[pos+1][1]
            if reading>data[pos+1][0]:
                return _interpolate(data[pos+1],(reading,-1),data[pos])
            pos += (pos-prev_pos)/2 if pos>prev_pos else (prev_pos-pos)/2
    
            if pos==_pos: pos += 1
    
        i += 1
        prev_pos = _pos
    
    
if __name__=="__main__":
    
    import random, os

    data = ( #calibrate()
        (6.0, 0.0),
        (5.8, 3.56),
        (5.6, 5.29),
        (5.4, 7.18),
        (5.2, 8.49),
        (5.0, 9.04),
        (4.8, 9.65),
        (4.6, 10.0),
        (4.3, 10.5),
        (4.01, 11.23),
        (3.87, 12.04),
        (3.68, 12.5),
        (3.64, 12.53),
        (3.61, 12.59),
        (3.58, 12.69),
        (3.52, 12.81),
        (3.21, 13.06),
        (3.07, 14.23),
        (2.49, 16.14),
        (2.08, 16.91),
        (1.98, 17.52),
    )

    def show_table():
        os.system('clear')
        print "%8s%8s"%('X-data','Y-data')
        print '  --------------'
        for r in data:
            print '%8.3f%8.3f'%(r[0],r[1])
        print

    while 1:
        show_table()
        n = input('x-value(-1 to exit): ')
        if n==-1: break
        print "\nx={}, y={}".format(n, get_actual_value(data,n,len(data)))
        raw_input('\npress enter to continue...')
