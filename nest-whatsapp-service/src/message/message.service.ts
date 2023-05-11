import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventsService } from 'src/events/events.service';
import { HttpCustomService } from 'src/providers/http/http.service';
import { actions } from './actions';
import { MESSAGES } from './messages';

@Injectable()
export class MessageService {
  id = this.configService.get('WHATSAPP_ID');
  token = this.configService.get('WHATSAPP_TOKEN');
  url = 'https://graph.facebook.com/v16.0/';
  access_token = '/messages?access_token=';
  headers = { 'Content-Type': 'application/json' };
  urlPost = this.url + this.id + this.access_token + this.token;

  constructor(
    private readonly httpService: HttpCustomService,
    private readonly configService: ConfigService,
    private readonly eventsService: EventsService,
  ) {}

  async action(action: string, dataAction: any) {
    const templates = [];
    const actionFunction = actions[action];

    if (!actionFunction) {
      throw new Error('Accion invalida');
    }

    actionFunction(dataAction, templates);
    dataAction.name = action;
    return await this.sendMessage(this.urlPost, dataAction, templates);
  }

  async sendMessage(url, dataAction, templates) {
    const dataMessage = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: dataAction.to,
      type: 'template',
      template: {
        name: dataAction.name,
        language: {
          code: 'en_US',
        },
        //components: [{ ...templates[0] }],
        components: templates,
      },
    };
    //console.log(dataMessage.template.components[0].parameters[0]);
    const { status, data, config } = await this.httpService.postMessage(
      this.urlPost,
      dataMessage,
      // templates,
    );

    this.eventsService
      .send(MESSAGES.messageSent, { config, status, data }, 'storing')
      .subscribe(() => {
        return { config, status, data };
      });
    return { status, data, config };
  }

  async sendMessageWTemplate(message: any) {
    const { status, data, config } = await this.httpService.postMessage(
      this.urlPost,
      message,
    );

    this.eventsService
      .send(MESSAGES.messageSent, { config, status, data }, 'storing')
      .subscribe(() => {
        return { config, status, data };
      });
    return { config, status, data };
  }

  /* async emitMessage(messageType: string, data: any) {
    console.log(MESSAGES[messageType]);
    await this.eventsService.emit(MESSAGES[messageType], data);
  } */

  send(event: string, data: any, client) {
    try {
      return this.eventsService.send(event, data, client);
    } catch (error) {
      console.log(error);
    }
  }
}
