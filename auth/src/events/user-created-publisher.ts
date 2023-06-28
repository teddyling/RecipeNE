import { Publisher, Subjects, UserCreatedEvent } from "@dongbei/utilities";

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
}
