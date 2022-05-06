import { Injectable } from '@nestjs/common';
import { client } from 'websocket';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHello2(): string {
    return "wow";
  }

  translateBot(): void {
    const twitchclient = new client()

    twitchclient.on("connectFailed", (error) => {
      console.log("error: " + error.toString())
    })


    twitchclient.on('connect', (connection) => {
      console.log('WebSocket Client Connected: '+ connection);
    })

    twitchclient.connect("ws://irc-ws.chat.twitch.tv:80")

    this.twitchTest(twitchclient)
  }


  twitchTest(twitchClient: client): void {
    const clientId = "b4aod3budq51j66kdacw5axw0xganm"
    const key = "kpudz7gmp0zx8xal914cxwvhxnrznp"

    twitchClient.on('connect', (connection) => {
      connection.sendUTF(`PASS oauth:${key}`);

      connection.sendUTF('JOIN #rravioliii');
    })
  }
}
