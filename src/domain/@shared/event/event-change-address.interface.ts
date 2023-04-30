import EventInterface from "../../@shared/event/event.interface";

export default interface EventChangeAddressInterface extends EventInterface {
  id: string;
  name: string;
  address: string;
}
