//import { MessageModel } from './schemas/message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class Message {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}
  async existsById(id: string) {
    /*
        Check if exists id message in database
        Returns boolean
    */
    if (await this.messageModel.findOne({ 'data.id': id })) {
      return true;
    }
    return false;
  }

  async existsByNumber(from: number) {
    /*
        Check if exists number in database
        Returns boolean
    */
    if (
      await this.messageModel.findOne({
        $or: [{ from }, { to: from }],
      })
    ) {
      return true;
    }
    return false;
  }

  async saveMessageSent(message: any) {
    const { to } = message;
    if (await this.existsByNumber(to)) {
      return await this.addDataMessage(message);
    }
    return await this.create(message);
  }

  async create(message: any) {
    /*
        Create phone number in database 
        Returns Promise
    */
    if (!message.from) {
      message.from = message.to;
    }
    const messageCreated = await this.messageModel.create(message);
    return messageCreated;
  }

  async addDataMessage(message: any) {
    /*
        Update message with message data 
        Returns result
    */
    if (message.display_phone_number && message.phone_number_id) {
      const {
        display_phone_number,
        phone_number_id,
        from,
        id,
        timestamp,
        type,
        ...data
      } = message;

      if (await this.existsByNumber(from)) {
        if (display_phone_number && phone_number_id) {
          return this.messageModel.findOneAndUpdate(
            { from: message.from },
            {
              display_phone_number,
              phone_number_id,
              $push: {
                data: {
                  id: id,
                  type: type,
                  message: data,
                  display_phone_number,
                  phone_number_id,
                },
              },
            },
          );
        }
        return;
      }
    } else {
      const { phoneNumber, data } = message;
      const { id, type } = data[0];

      if (await this.existsByNumber(phoneNumber)) {
        if (!(await this.existsById(id))) {
          return this.messageModel.findOneAndUpdate(
            { from: phoneNumber },
            {
              $push: {
                data: {
                  id: id,
                  type: type,
                  message: data[0].message,
                  status: [],
                },
              },
            },
          );
        }
      }
    }

    return this.create(message);
  }

  public async updateStatus(message: any) {
    const { id, status } = message;
    let { timestamp, recipient_id } = message;
    timestamp = parseInt(timestamp);
    recipient_id = parseInt(recipient_id);
    const result = await this.messageModel.findOneAndUpdate(
      /* $or: [
                {from: recipient_id},
                {to: recipient_id}
            ] */
      {
        from: recipient_id,
        data: {
          $elemMatch: {
            id: id,
          },
        },
      },
      {
        $push: {
          'data.$.status': { status, timestamp },
        },
      },
    );
  }

  async saveMessageReceived(message: any) {
    const {
      display_phone_number,
      phone_number_id,
      from,
      id,
      timestamp,
      type,
      ...dataMessage
    } = message;

    if (display_phone_number && phone_number_id) {
      if (await this.existsByNumber(from)) {
        return await this.addDataMessage(message);
      }

      message = {
        display_phone_number,
        phone_number_id,
        from,
        data: [
          {
            id,
            type,
            [type]: dataMessage,
            display_phone_number,
            phone_number_id,
          },
        ],
      };

      return await this.create(message);
    }
  }
}
