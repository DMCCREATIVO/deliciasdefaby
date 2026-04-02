import { pb } from '../client';

export const createOrderMessagesCollection = async () => {
  try {
    await pb.collections.create({
      name: 'order_messages',
      type: 'base',
      schema: [
        {
          name: 'order_id',
          type: 'relation',
          required: true,
          options: {
            collectionId: 'orders',
            cascadeDelete: false,
          },
        },
        {
          name: 'channel',
          type: 'select',
          required: true,
          options: {
            maxSelect: 1,
            values: ['whatsapp'],
          },
        },
        {
          name: 'to_phone',
          type: 'text',
          required: false,
        },
        {
          name: 'message_text',
          type: 'text',
          required: true,
        },
        {
          name: 'message_status',
          type: 'select',
          required: false,
          options: {
            maxSelect: 1,
            values: ['sent', 'failed'],
          },
        },
      ],
      listRule: "",
      viewRule: "",
      createRule: "@request.auth.role = 'admin'",
      updateRule: "@request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'admin'",
    });

    console.log('✅ Colección order_messages creada');
  } catch (error) {
    console.error('Error creating order_messages collection:', error);
  }
};

