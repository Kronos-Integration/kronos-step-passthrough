import { Step } from 'kronos-step';

export class PassthroughStep extends Step {
  get name() {
    return 'kronos-step-passthrough';
  }

  get description() {
    return "This step just passes all requests from its 'in' endpoint to its 'out' endpoint.";
  }

  get endpoints() {
    return {
      in: {
        in: true
      },
      out: {
        out: true
      }
    };
  }

  async _start() {
    this.endpoints.in.receive = request =>
      this.endpoints.out.connected.receive(request);
  }
}

async function registerWithManager(manager) {
  return manager.registerStep(PassthroughStep);
}
