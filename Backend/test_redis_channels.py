
import os
import asyncio
import django

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "crop_backend.settings",
)

django.setup()

from channels.layers import get_channel_layer


async def main():
    layer = get_channel_layer()
    channel = await layer.new_channel("test_ws")
    group = "test_notifications"

    try:
        await layer.group_add(group, channel)

        await layer.group_send(
            group,
            {
                "type": "notification.message",
                "data": {"message": "Redis notification test"},
            },
        )

        message = await asyncio.wait_for(
            layer.receive(channel),
            timeout=10,
        )

        print("GROUP TEST SUCCESS:", message)

    finally:
        await layer.group_discard(group, channel)
        await layer.close_pools()


if __name__ == "__main__":
    asyncio.run(main())
