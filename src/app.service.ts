import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import TwitchJs, { Chat } from 'twitch-js';
import axios from 'axios';
import { Constants } from './constants';

dotenv.config();

interface responseType {
  access_token?: string,
  refresh_token?: string,
}

@Injectable()
export class AppService {
  private clientId: string;
  private token: string;
  private secret: string;
  private refreshToken: string;
  private twitchUrl: string;

  constructor() {
    this.clientId = process.env.CLIENT;
    this.token = process.env.TOKEN;
    this.secret = process.env.SECRET;
    this.refreshToken = process.env.REFRESH;
    this.twitchUrl = 'https://id.twitch.tv/oauth2/token'
  }

  async startChatSession(): Promise<Chat> {

    const onAuthenticationFailure = async () => {
      let response = await axios.post<responseType>(this.twitchUrl, 
        {
          grant_type: Constants.REFRESHTYPE,
          refresh_token: this.refreshToken,
          client_id: this.clientId,
          client_secret: this.secret,
        },
      )
      return response.data.access_token;
    }
  
    const { chat } = new TwitchJs({ token: this.token, username: 'testravioliBot', onAuthenticationFailure})

    await chat.connect();

    await chat.join('#papakimbuislove');
    
    return chat;
  }
}
