import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  private pusher: any;
  private channel: any;

  constructor(private http: HttpClient) {
    this.pusher = new Pusher('0497f0a5fc5b213d1d73', {
      cluster: 'ap2'
    });
    this.channel = this.pusher.subscribe('chat');
  }

  getMessages(): Observable<any> {
    return this.http.get('http://localhost:3000/messages');
  }

  sendMessage(message: string): Observable<any> {
    return this.http.post('http://localhost:3000/messages', { content: message });
  }

  subscribeToNewMessages(callback: (message: any) => void): void {
    this.channel.bind('new_message', callback);
  }

  unsubscribeFromNewMessages(): void {
    this.channel.unbind('new_message');
  }

}
