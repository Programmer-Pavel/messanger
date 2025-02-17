@SubscribeMessage('startPrivateChat')
  async handleStartPrivateChat(
    @MessageBody() data: { fromUserId: string; toUserId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomId = await this.chatService.getOrCreatePrivateRoom(data.fromUserId, data.toUserId);
    client.join(roomId);

    const messages = await this.chatService.getRoomMessages(roomId);
    return { event: 'privateChat', data: { roomId, messages } };
  }

  @SubscribeMessage('sendPrivateMessage')
  async handlePrivateMessage(
    @MessageBody() data: { fromUserId: string; toUserId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomId = await this.chatService.getOrCreatePrivateRoom(data.fromUserId, data.toUserId);

    const messageData = {
      content: data.message,
      userId: parseInt(data.fromUserId),
      roomId: roomId,
    };

    const savedMessage = await this.chatService.sendMessage(roomId, messageData);

    // Отправляем сообщение только участникам приватного чата
    this.server.to(roomId).emit('onPrivateMessage', savedMessage);

    return { event: 'privateMessage', data: savedMessage };
  }