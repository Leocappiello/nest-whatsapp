import { IsNumber, IsString } from 'class-validator';

export default class MessageSentDTO {
  messaging_product: string;

  @IsNumber()
  to: number;

  @IsString()
  type: string;

  //data: object;

  constructor(
    messaging_product: string,
    to: number,
    type: string,
    //data: object
  ) {
    this.messaging_product = messaging_product;
    this.to = to;
    this.type = type;
    //this.data = data;
  }
}
