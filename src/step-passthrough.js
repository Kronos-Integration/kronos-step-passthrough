import { Step } from 'kronos-step';

export class PassthroughStep extends Step {
  static get name() {
    return 'kronos-step-passthrough';
  }

  static get description() {
    return "This step just passes all requests from its 'in' endpoint to its 'out' endpoint.";
  }

  static get endpoints() {
    return Object.assign(
      {
        in: {
          in: true
        },
        out: {
          out: true
        }
      },
      Step.endpoints
    );
  }

  async _start() {
    this.endpoints.in.receive = request =>
      this.endpoints.out.connected.receive(request);
  }
}

export async function registerWithManager(manager) {
  return manager.registerStep(PassthroughStep);
}
