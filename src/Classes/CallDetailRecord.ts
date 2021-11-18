enum CallDirectionEnum {
    I = 'cdInput',
    O = 'cdOutput',
    H = 'cdInternal',
    U = 'unknown'
}

export class CallDetailRecord {
    internalCallNumber: string;
    externalCallNumber: string;
    CallDateTime: string;
    CallDirection: CallDirectionEnum;
    Trunk: string;
    Duration: number;

    constructor(inputString: string) {
        this.CallDirection = CallDirectionEnum.U;
        this.ParseCDR(inputString);
    }

    public ToMysql(): string {
        let request:string = "";
        
        if(this.isValid()){
            request = 'Call ImportCall("'+this.CallDateTime+'", "'+this.internalCallNumber+'", "'+this.externalCallNumber+'", '+this.Duration+', "'+this.CallDirection.toString()+'", '+this.Trunk.toString()+')';
        }

        return request;
    }

    private isValid(): boolean {
        return (this.Duration != null && this.internalCallNumber != "" && this.externalCallNumber != "" && this.CallDirection != CallDirectionEnum.U && this.Trunk != "") ? true : false;
    }

    private ParseCDR(inputData: string): void {
       if(inputData != "") {
            let _Data = inputData.split('+');
            if(_Data.length > 5 && _Data.length <= 7) {
                let getTrunkString = _Data[0].replace(/^D+/g, '');
                this.Trunk = (getTrunkString.trim() != "") ? getTrunkString : '000';

                this.internalCallNumber = _Data[1].trim();

                switch(_Data[3].trim as any) {
                    case 'I': this.CallDirection = CallDirectionEnum.I;
                        break;
                    case "O": this.CallDirection = CallDirectionEnum.O;
                        break;
                    case "H": this.CallDirection = CallDirectionEnum.H;
                        break;
                }

                this.externalCallNumber = _Data[4].trim();
                this.Duration = parseInt(_Data[5].replace(/^D+/g, ''));

                let Year = _Data[6].substr(4,2);
                let Month = _Data[6].substr(2,2);
                let Day = _Data[6].substr(0,2);
                let Hour = _Data[6].substr(6,2);
                let Minute = _Data[6].substr(8,2);
                let Second = _Data[6].substr(10,2);

                this.CallDateTime = Year + '-' + Month + '-' + Day + ' ' + Hour + ':' + Minute + ':' + Second;
            }
       } 
    }
}