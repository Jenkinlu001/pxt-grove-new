
const initRegisterArray: number[] = [
    0xEF003229, 0x33013400, 0x35013600, 0x37073817,
    0x39063A12, 0x3F004002, 0x41FF4201, 0x462D470F,
    0x483C4900, 0x4A1E4B00, 0x4C204D00, 0x4E1A4F14,
    0x50005110, 0x52005C02, 0x5D005E10, 0x5F3F6027,
    0x61286200, 0x630364F7, 0x650366D9, 0x67036801,
    0x69C86A40, 0x6D046E00, 0x6F007080, 0x71007200,
    0x730074F0, 0x75008042, 0x81448204, 0x83208420,
    0x85008610, 0x87008805, 0x89188A10, 0x8B018C37,
    0x8D008EF0, 0x8F819006, 0x9106921E, 0x930D940A,
    0x950A960C, 0x9705980A, 0x99419A14, 0x9B0A9C3F,
    0x9D339EAE, 0x9FF9A048, 0xA113A210, 0xA308A430,
    0xA519A610, 0xA708A824, 0xA904AA1E, 0xAB1ECC19,
    0xCD0BCE13, 0xCF64D021, 0xD10FD288, 0xE001E104,
    0xE241E3D6, 0xE400E50C, 0xE60AE700, 0xE800E900,
    0xEE07EF01, 0x001E011E, 0x020F0310, 0x04020500,
    0x06B00704, 0x080D090E, 0x0A9C0B04, 0x0C050D0F,
    0x0E020F12, 0x10021102, 0x12001301, 0x14051507,
    0x16051707, 0x18011904, 0x1A051B0C, 0x1C2A1D01,
    0x1E002100, 0x22002300, 0x25012600, 0x2739287F,
    0x29083003, 0x3100321A, 0x331A3407, 0x35073601,
    0x37FF3836, 0x39073A00, 0x3EFF3F00, 0x40774140,
    0x42004330, 0x44A0455C, 0x46004700, 0x48584A1E,
    0x4B1E4C00, 0x4D004EA0, 0x4F805000, 0x51005200,
    0x53005400, 0x57805910, 0x5A085B94, 0x5CE85D08,
    0x5E3D5F99, 0x60456140, 0x632D6402, 0x65966600,
    0x67976801, 0x69CD6A01, 0x6BB06C04, 0x6D2C6E01,
    0x6F327100, 0x72017335, 0x74007533, 0x76317701,
    0x7C847D03, 0x7E01
];

let TubeTab: number [] = [
    0x3f, 0x06, 0x5b, 0x4f, 0x66, 0x6d, 0x7d, 0x07,
    0x7f, 0x6f, 0x77, 0x7c, 0x39, 0x5e, 0x79, 0x71
];

/**
 * Grove Gestures
 */
enum GroveGesture {
    //% block=None
    None = 0,
    //% block=Right
    Right = 1,
    //% block=Left
    Left = 2,
    //% block=Up
    Up = 3,
    //% block=Down
    Down = 4,
    //% block=Forward
    Forward = 5,
    //% block=Backward
    Backward = 6,
    //% block=Clockwise
    Clockwise = 7,
    //% block=Anticlockwise
    Anticlockwise = 8,
    //% block=Wave
    Wave = 9
}

enum GroveJoystickKey {
    //% block=None
    None = 0,
    //% block=Right
    Right = 1,
    //% block=Left
    Left = 2,
    //% block=Up
    Up = 3,
    //% block=Down
    Down = 4,
    //% block=Upper left
    UL = 5,
    //% block=Upper right
    UR = 6,
    //% block=Lower left
    LL = 7,
    //% block=Lower right
    LR = 8,
    //% block=press
    Press = 9
}


/**
 * Functions to operate Grove module.
 */
//% weight=10 color=#9F79EE icon="\uf108" block="Grove"
namespace grove {
    /**
     * 
     */
    export class PAJ7620 {
        private paj7620WriteReg(addr: number, cmd: number) {
            let buf: Buffer = pins.createBuffer(2);

            buf[0] = addr;
            buf[1] = cmd;

            pins.i2cWriteBuffer(0x73, buf);
        }

        private paj7620ReadReg(addr: number): number {
            let buf: Buffer = pins.createBuffer(1);

            buf[0] = addr;

            pins.i2cWriteBuffer(0x73, buf, false);

            buf = pins.i2cReadBuffer(0x73, 1, false);

            return buf[0];
        }

        private paj7620SelectBank(bank: number) {
            if (bank == 0) this.paj7620WriteReg(0xEF, 0);
            else if (bank == 1) this.paj7620WriteReg(0xEF, 1);
        }

        private paj7620Init() {
            let temp = 0;

            this.paj7620SelectBank(0);
            this.paj7620SelectBank(0);

            temp = this.paj7620ReadReg(0);
            if (temp == 0x20) {
                 for (let i = 0; i < 109; i++) {

                    let data1 = (initRegisterArray[i] >>> 24) & 0x000000FF;
                    let data2 = (initRegisterArray[i] >>> 16) & 0x000000FF;
                    let data3 = (initRegisterArray[i] >>> 8) & 0x000000FF;
                    let data4 = (initRegisterArray[i]) & 0x000000FF;
                    this.paj7620WriteReg(data1, data2);
                    this.paj7620WriteReg(data3, data4);
                }
                let data5 = (initRegisterArray[109] >>> 8) & 0x00FF;
                let data6 = (initRegisterArray[109]) & 0x00FF;
                this.paj7620WriteReg(data5, data6);
            }

            this.paj7620SelectBank(1); 
            this.paj7620WriteReg(0x65, 0x12); 
            this.paj7620SelectBank(0); 
        }

        /**
         * Create a new driver of Grove - Gesture
         */
        //% blockId=grove_gesture_init block="%strip|initiate the Grove - Gesture"
        //% advanced=true
        init() {
            this.paj7620Init();
            basic.pause(200);
        }

        /**
         * Detect and recognize the gestures from Grove - Gesture
         */
        //% blockId=grove_gesture_read block="%strip|get gesture"
        //% advanced=true
        read(): number {
            let data = 0, result = 0;

            data = this.paj7620ReadReg(0x43);
            switch (data) {
                case 0x01:
                    result = GroveGesture.Right;
                break;

                case 0x02:
                    result = GroveGesture.Left;
                break;

                case 0x04:
                    result = GroveGesture.Up;
                break;

                case 0x08:
                    result = GroveGesture.Down;
                break;

                case 0x10:
                    result = GroveGesture.Forward;
                break;

                case 0x20:
                    result = GroveGesture.Backward;
                break;

                case 0x40:
                    result = GroveGesture.Clockwise;
                break;

                case 0x80:
                    result = GroveGesture.Anticlockwise;
                break;

                default:
                    data = this.paj7620ReadReg(0x44);
                    if (data == 0x01)
                        result = GroveGesture.Wave;
                break;
            }

            return result;
        }
    }
    
    /**
     * 
     */
    export class TM1637
    {
        clkPin: DigitalPin;
        dataPin: DigitalPin;
        brightnessLevel: number;     
        pointFlag: boolean;
        buf: Buffer;

        private writeByte(wrData: number) 
        {
            for(let i = 0; i < 8; i ++)
            {
                pins.digitalWritePin(this.clkPin, 0);
                if(wrData & 0x01)pins.digitalWritePin(this.dataPin, 1);
                else pins.digitalWritePin(this.dataPin, 0);
                wrData >>= 1;
                pins.digitalWritePin(this.clkPin, 1);
            }
            
            pins.digitalWritePin(this.clkPin, 0); // Wait for ACK
            pins.digitalWritePin(this.dataPin, 1);
            pins.digitalWritePin(this.clkPin, 1);
        }
        
        private start()
        {
            pins.digitalWritePin(this.clkPin, 1);
            pins.digitalWritePin(this.dataPin, 1);
            pins.digitalWritePin(this.dataPin, 0);
            pins.digitalWritePin(this.clkPin, 0);
        }
        
        private stop()
        {
            pins.digitalWritePin(this.clkPin, 0);
            pins.digitalWritePin(this.dataPin, 0);
            pins.digitalWritePin(this.clkPin, 1);
            pins.digitalWritePin(this.dataPin, 1);
        }
        
        private coding(dispData: number): number
        {
            let pointData = 0;
            
            if(this.pointFlag == true)pointData = 0x80;
            else if(this.pointFlag == false)pointData = 0;
            
            if(dispData == 0x7f)dispData = 0x00 + pointData;
            else dispData = TubeTab[dispData] + pointData;
            
            return dispData;
        } 

        /**
         * Show a 4 digits number on display
         * @param dispData value of number
         */
        //% blockId=grove_tm1637_display_number block="%strip|show number|%dispData"
        show(dispData: number)
        {       
            if(dispData < 10)
            {
                this.bit(dispData, 3);
                this.bit(0x7f, 2);
                this.bit(0x7f, 1);
                this.bit(0x7f, 0);
                
                this.buf[3] = dispData;
                this.buf[2] = 0x7f;
                this.buf[1] = 0x7f;
                this.buf[0] = 0x7f;
            }
            else if(dispData < 100)
            {
                this.bit(dispData % 10, 3);
                this.bit((dispData / 10) % 10, 2);
                this.bit(0x7f, 1);
                this.bit(0x7f, 0);
                
                this.buf[3] = dispData % 10;
                this.buf[2] = (dispData / 10) % 10;
                this.buf[1] = 0x7f;
                this.buf[0] = 0x7f;
            }
            else if(dispData < 1000)
            {
                this.bit(dispData % 10, 3);
                this.bit((dispData / 10) % 10, 2);
                this.bit((dispData / 100) % 10, 1);
                this.bit(0x7f, 0);
                
                this.buf[3] = dispData % 10;
                this.buf[2] = (dispData / 10) % 10;
                this.buf[1] = (dispData / 100) % 10;
                this.buf[0] = 0x7f;
            }
            else
            {
                this.bit(dispData % 10, 3);
                this.bit((dispData / 10) % 10, 2);
                this.bit((dispData / 100) % 10, 1);
                this.bit((dispData / 1000) % 10, 0);
                
                this.buf[3] = dispData % 10;
                this.buf[2] = (dispData / 10) % 10;
                this.buf[1] = (dispData / 100) % 10;
                this.buf[0] = (dispData / 1000) % 10;
            }
        }
        
        /**
         * Set the brightness level of display at from 0 to 7
         * @param level value of brightness level
         */
        //% blockId=grove_tm1637_set_display_level block="%strip|brightness level to|%level"
        //% level.min=0 level.max=7
        set(level: number)
        {
            this.brightnessLevel = level;
            
            this.bit(this.buf[0], 0x00);
            this.bit(this.buf[1], 0x01);
            this.bit(this.buf[2], 0x02);
            this.bit(this.buf[3], 0x03);
        }
        
        /**
         * Show a single number from 0 to 9 at a specified digit of Grove - 4-Digit Display
         * @param dispData value of number
         * @param bitAddr value of bit number
         */
        //% blockId=grove_tm1637_display_bit block="%strip|show single number|%dispData|at digit|%bitAddr"
        //% dispData.min=0 dispData.max=9
        //% bitAddr.min=0 bitAddr.max=3
        //% advanced=true
        bit(dispData: number, bitAddr: number)
        {
            if((dispData == 0x7f) || ((dispData <= 9) && (bitAddr <= 3)))
            {
                let segData = 0;
                
                segData = this.coding(dispData);
                this.start();
                this.writeByte(0x44);
                this.stop();
                this.start();
                this.writeByte(bitAddr | 0xc0);
                this.writeByte(segData);
                this.stop();
                this.start();
                this.writeByte(0x88 + this.brightnessLevel);
                this.stop();
                
                this.buf[bitAddr] = dispData;
            }
        }
        
        /**
         * Turn on or off the colon point on Grove - 4-Digit Display
         * @param pointEn value of point switch
         */
        //% blockId=grove_tm1637_display_point block="%strip|turn|%point|colon point"
        //% advanced=true
        point(point: boolean)
        {
            this.pointFlag = point;
            
            this.bit(this.buf[0], 0x00);
            this.bit(this.buf[1], 0x01);
            this.bit(this.buf[2], 0x02);
            this.bit(this.buf[3], 0x03);
        }
        
        /**
         * Clear the display
         */
        //% blockId=grove_tm1637_display_clear block="%strip|clear"
        //% advanced=true
        clear()
        {
            this.bit(0x7f, 0x00);
            this.bit(0x7f, 0x01);
            this.bit(0x7f, 0x02);
            this.bit(0x7f, 0x03);
        }
    }


    export class GroveJoystick
    {
        /**
         * Detect position from Grove - Thumb Joystick
         * @param xPin
         * @param yPin
         */
        //% blockId=grove_joystick_read block="%strip|read position of joystick"
        //% advanced=true
        read(xPin: AnalogPin, yPin: AnalogPin): number {
            let xdata = 0, ydata = 0, result = 0;
            if (xPin && yPin) {
                xdata = pins.analogReadPin(xPin);
                ydata = pins.analogReadPin(yPin);
                if (xdata > 1000) {
                    result = GroveJoystickKey.Press;
                }
                else if (xdata > 600) {
                    if (ydata > 600) result = GroveJoystickKey.UR;
                    else if (ydata < 400) result = GroveJoystickKey.LR;
                    else result = GroveJoystickKey.Right;
                }
                else if (xdata < 400) {
                    if (ydata > 600) result = GroveJoystickKey.UL;
                    else if (ydata < 400) result = GroveJoystickKey.LL;
                    else result = GroveJoystickKey.Left;
                }
                else {
                    if (ydata > 600) result = GroveJoystickKey.Up;
                    else if (ydata < 400) result = GroveJoystickKey.Down;
                    else result = GroveJoystickKey.None;
                }
            }
            else {
                result =  GroveJoystickKey.None;
            }
            return result;
        }
    }
    
    const gestureEventId = 3100;
    const joystickEventID = 3101;
    let lastGesture = GroveGesture.None;
    let lastJoystick = GroveJoystickKey.None;
    let distanceBackup: number = 0;
    let joystick = new GroveJoystick();
    let paj7620 = new PAJ7620();
    
    /**
     * Create a new driver of Grove - Ultrasonic Sensor to measure distances in cm
     * @param pin signal pin of ultrasonic ranger module
     */
    //% blockId=grove_ultrasonic_centimeters block="Ultrasonic Sensor (in cm) at|%pin"
    export function measureInCentimeters(pin: DigitalPin): number
    {
        let duration = 0;
        let RangeInCentimeters = 0;
        
        pins.digitalWritePin(pin, 0);
        control.waitMicros(2);
        pins.digitalWritePin(pin, 1);
        control.waitMicros(20);
        pins.digitalWritePin(pin, 0);        
        duration = pins.pulseIn(pin, PulseValue.High, 50000); // Max duration 50 ms

        RangeInCentimeters = duration * 153 / 29 / 2 / 100;
               
        if(RangeInCentimeters > 0) distanceBackup = RangeInCentimeters;
        else RangeInCentimeters = distanceBackup;

        basic.pause(50);
        
        return RangeInCentimeters;
    }
    
    /**
     * Create a new driver Grove - Ultrasonic Sensor to measure distances in inch
     * @param pin signal pin of ultrasonic ranger module
     */
    //% blockId=grove_ultrasonic_inches block="Ultrasonic Sensor (in inch) at|%pin"
    export function measureInInches(pin: DigitalPin): number
    {
        let duration = 0;
        let RangeInInches = 0;
        
        pins.digitalWritePin(pin, 0);
        control.waitMicros(2);
        pins.digitalWritePin(pin, 1);
        control.waitMicros(20);
        pins.digitalWritePin(pin, 0);        
        duration = pins.pulseIn(pin, PulseValue.High, 100000); // Max duration 100 ms
        
        RangeInInches = duration * 153 / 74 / 2 / 100;
        
        if(RangeInInches > 0) distanceBackup = RangeInInches;
        else RangeInInches = distanceBackup;
        
        basic.pause(50);
        
        return RangeInInches;
    }
    
    /**
     * Create a new driver Grove - 4-Digit Display
     * @param clkPin value of clk pin number
     * @param dataPin value of data pin number
     */
    //% blockId=grove_tm1637_create block="4-Digit Display at|%clkPin|and|%dataPin"
    export function createDisplay(clkPin: DigitalPin, dataPin: DigitalPin): TM1637
    {
        let display = new TM1637();
        
        display.buf = pins.createBuffer(4);
        display.clkPin = clkPin;
        display.dataPin = dataPin;
        display.brightnessLevel = 0;
        display.pointFlag = false;
        display.clear();
        
        return display;
    }
    
    /**
     * Do something when a gesture is detected by Grove - Gesture
     * @param gesture type of gesture to detect
     * @param handler code to run
     */
    //% blockId=grove_gesture_create_event block="on Gesture|%gesture"
    export function onGesture(gesture: GroveGesture, handler: () => void) {
        control.onEvent(gestureEventId, gesture, handler);
        
        paj7620.init();
        control.inBackground(() => {
            while(true) {
                const gesture = paj7620.read();
                if (gesture != lastGesture) {
                    lastGesture = gesture;
                    control.raiseEvent(gestureEventId, lastGesture);
                }
                basic.pause(50);
            }
        })
        
    }


    /**
     * Do something when a key is detected by Grove - Thumb Joystick
     * @param key type of joystick to detect
     * @param xpin
     * @param ypin
     * @param handler code to run
     */
    //% blockId=grove_joystick_create_event block="on Key|%key|at|%xpin|and|%ypin|"
    export function onJoystick(key: GroveJoystickKey, xpin: AnalogPin, ypin: AnalogPin, handler: () => void) {
        control.onEvent(joystickEventID, key, handler);
        control.inBackground(() => {
            while(true) {
                const key = joystick.read(xpin, ypin);
                if (key != lastJoystick) {
                    lastJoystick = key; 
                    control.raiseEvent(joystickEventID, lastJoystick);
                }
                basic.pause(50);
            }
        })
        
    }
}