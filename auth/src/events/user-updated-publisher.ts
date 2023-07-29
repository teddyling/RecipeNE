import { Publisher, Subjects, UserUpdatedEvents } from "@dongbei/utilities";

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvents> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
}
