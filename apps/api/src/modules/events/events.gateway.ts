import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('match:queue:join')
  handleJoinQueue(client: Socket, data: any) {
    // Matchmaking logic
    return { success: true };
  }

  @SubscribeMessage('match:action')
  handleMatchAction(client: Socket, data: any) {
    // Game action logic
    return { success: true };
  }
}
