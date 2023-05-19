import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MessageService } from './message.service';

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @MessagePattern('statusReceived')
  async statusReceived(data) {
    console.log('recibido');
    this.messageService.handleMessageStatusReceived(data);
    return true;
  }

  @MessagePattern('messageReceived')
  async messageReceived(data) {
    console.log('recibido');
    return this.messageService.handleMessageReceived(data);
  }

  @MessagePattern('messageSent')
  async messageSent(data) {
    console.log('recibido');
    return this.messageService.handleMessageSent(data);
  }

  @MessagePattern('errorReceived')
  async errorReceived(data) {
    console.log('recibido');
    return console.log(data);
  }
}
