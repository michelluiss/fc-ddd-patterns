import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: entity.id,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const sequelize = OrderModel.sequelize;

    return await sequelize.transaction(async (t) => {
      await OrderItemModel.destroy({
        where: { order_id: entity.id },
        transaction: t,
      })

      const items  = entity.items.map((item)  => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id,
      }));

      await OrderItemModel.bulkCreate(items, { transaction: t });

      await OrderModel.update({
          customer_id: entity.customerId,
          total: entity.total(),
        },
        {
          where: { id: entity.id },
          transaction: t,
        }
      )
    });
  }

  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: { id },
        include: ['items']
      });
    } catch (error) {
      throw new Error("Order not found");
    }

    const orderItens = orderModel.items?.map((item) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity))
    return new Order(orderModel.id, orderModel.customer_id, orderItens);
  }

  async findAll(): Promise<Order[]> {
    const ordersModels = await OrderModel.findAll({ include: ['items'] });
    const orders = ordersModels.map((orderModels) => {
      const orderItens = orderModels.items?.map((item) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity))
      let order = new Order(orderModels.id, orderModels.customer_id, orderItens);

      return order;
    });

    return orders;
  }
}
