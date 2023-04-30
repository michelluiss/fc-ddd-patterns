
import EventChangeAddressInterface from "../../@shared/event/event-change-address.interface";

export default class CustomerChangeAddressEvent implements EventChangeAddressInterface {
  dataTimeOccurred: Date;
  eventData: any;
  id: string;
  name: string;
  address: string;

  constructor({ eventData, id, name, address }: EventChangeAddressInterface) {
    this.eventData = eventData;
    this.id = id;
    this.name = name;
    this.address = address;
  }
}
