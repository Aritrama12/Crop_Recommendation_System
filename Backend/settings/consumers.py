from channels.generic.websocket import AsyncWebsocketConsumer
import json


class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        # print("USER OBJECT:", self.scope["user"])
        self.user = self.scope["user"]

        if self.user.is_anonymous:
            # print("ANONYMOUS USER DETECTED")
            await self.close()
            return

        self.group_name = (
            f"user_{self.user.id}"
        )

        # print("GROUP:", self.group_name)

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

        # print(
        #     f"WebSocket Connected: {self.user.username}"
        # )

    async def disconnect(self, close_code):
 
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

        # print("WebSocket Disconnected")

    async def notification_message(
        self,
        event
    ):

        print("WS EVENT RECEIVED")
        await self.send(
            text_data=json.dumps(
                event["data"]
            )
        )