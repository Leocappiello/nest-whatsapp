import { IsNumber, IsString } from 'class-validator';

export default class MessageReceivedDTO {
  @IsNumber()
  display_phone_number: number;

  @IsNumber()
  phone_number_id: number;

  @IsNumber()
  from: number;

  @IsString()
  id: string;

  timestamp: number | string;

  constructor(
    display_phone_number: number,
    phone_number_id: number,
    from: number,
    id: string,
    timestamp: number | string,
  ) {
    this.display_phone_number = display_phone_number;
    this.phone_number_id = phone_number_id;
    this.from = from;
    this.id = id;
    this.timestamp = timestamp;
  }
}
