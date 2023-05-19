import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { EventsService } from 'src/events/events.service';
import DocDTO from './dto/docs/doc.dto';
import MessageSentDTO from './dto/postDto/messageSent.dto';
import MessageReceivedDTO from './dto/postDto/received.dto';
import { MessageService } from './message.service';

@WebSocketGateway()
@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly eventsService: EventsService,
  ) {}

  @Post('cachedoc')
  async cacheDoc(
    @Body() doc: DocDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { filename, link } = doc;
    return this.messageService
      .send(
        'cachedoc',
        {
          filename,
          link,
        },
        'caching',
      )
      .subscribe((data) => {
        if (data) {
          return res.sendStatus(200);
        }
        return res.sendStatus(400);
      });
  }

  @Post('/webhook')
  async handleMessage(@Body() body, @Req() req: Request, @Res() res: Response) {
    try {
      /*
        Message to receive
      */
      if (body.object) {
        const { changes } = body.entry[0];
        if (changes[0].value.statuses) {
          if (changes[0].value.statuses[0].errors) {
            /*
              ERROR 
            */
            const { title, code } = changes[0].value.statuses[0].errors[0];

            const error = {
              title,
              code,
            };

            return this.messageService
              .send('errorReceived', error, 'storing')
              .subscribe((data) => {
                console.log(data);
              });
          }
          /*
            STATUS
          */
          return this.messageService
            .send('statusReceived', body, 'storing')
            .subscribe();
        } else {
          let { from } = changes[0].value.messages[0];
          const { timestamp } = changes[0].value.messages[0];
          const { display_phone_number, phone_number_id } =
            changes[0].value.metadata;
          const { id, ...data } = changes[0].value.messages[0];

          // delete '9' in phone number
          if (from.length > 12) {
            from = from.substr(0, 2) + from.substr(3, from.length);
          }

          const message = {
            display_phone_number,
            phone_number_id,
            from,
            id,
            timestamp,
            ...data,
          };

          // parses
          message.from = parseInt(from);
          message.phone_number_id = parseInt(phone_number_id);
          message.display_phone_number = parseInt(display_phone_number);
          message.timestamp = parseInt(timestamp);

          const messageDto = plainToInstance(MessageReceivedDTO, message);
          const errors = await validate(messageDto);
          if (!errors.length) {
            try {
              return this.messageService
                .send('messageReceived', messageDto, 'storing')
                .subscribe(() => {
                  return res.sendStatus(200);
                });
            } catch (error) {
              throw new Error(error);
            }
          }
          return res.status(400).json({ error: errors });
        }
      }

      /*
        Message to send
      */
      if (body.to) {
        const { messaging_product, type, ...data } = body;
        const to = parseInt(body.to) as number;
        //
        const messageSent: MessageSent = {
          messaging_product,
          to,
          type,
          ...data,
        };

        const message = plainToInstance(MessageSentDTO, messageSent);
        const errors = await validate(message);

        /* if (!errors.length) {
          const result = await this.messageService.sendMessageWTemplate(
            message,
          );
          return res.sendStatus(result.status);
        }
        return res.status(400).json({ error: errors }); */
        if (!errors.length) {
          const result = await this.messageService.sendMessageWTemplate(
            message,
          );
          return res.status(result.status).json(result);
        }
        return res.status(400).json({ error: errors });
      }

      /*
        Bad format message
      */
      res.status(500).json({ message: 'bad format message' });
    } catch (error) {
      res.status(500).json({ message: 'error' });
    }
  }

  @Post(':accion')
  async enviarWhatsapp(
    @Param('accion') accion: string,
    @Body() cuerpo: any,
    @Req() req,
    @Res() res: Response,
  ) {
    /* const { status, data } =  */
    await this.messageService.action(accion, cuerpo);
    res.sendStatus(200);
    /*
    if (data.error) {
      console.log(data.error.message);
    }
    return res.sendStatus(status); */
  }
  /* 
  @Post('/masive/:accion')
  async sendMassiveTemplate(
    @Param('accion') accion: string,
    @Body() cuerpo: NumberMassiveMessageDto,
    @Req() req,
    @Res() res: Response,
  ) {
    console.log(accion, ' masiva');
    cuerpo.number.forEach(async (elem) => {
      cuerpo.to = elem;
      const { status,  data } = await this.messageService.action(
        accion,
        cuerpo,
      );
      if (data.error) {
        console.log(data.error.message);
      }
    });
    return res.sendStatus(200);
  } */

  @Get('webhook')
  async verifyHook(@Req() req, @Res() res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === token) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  }
}
