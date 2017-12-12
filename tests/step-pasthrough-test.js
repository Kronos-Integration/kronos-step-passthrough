import test from 'ava';
import { PassthroughStep } from '../src/step-passthrough';

test('step-passthrough', t => {
  const owner = {};
  const step = new PassthroughStep(
    {
      type: 'kronos-step-passthrough',
      name: 'myPassThrough'
    },
    owner
  );
  t.deepEqual(
    step.toJSONWithOptions({
      includeRuntimeInfo: false,
      includeDefaults: false,
      includeName: true
    }),
    {
      type: 'kronos-step-passthrough',
      /*description:
        "This step just passes all requests from its 'in' endpoint to its 'out' endpoint.",*/
      name: 'myPassThrough',
      endpoints: {
        /*    in: {
          in: true
        },
        out: {
          out: true
        }*/
      }
    }
  );
});

/*
  it('Check that the step was created with its own name', () => {
      const stepBase = manager.createStepInstanceFromConfig(
        {
          type: 'kronos-step-passthrough',
          name: 'myPassThrough'
        },
        manager
      );

      assert.ok(stepBase);
      assert.deepEqual(
        stepBase.toJSONWithOptions({
          includeRuntimeInfo: false,
          includeDefaults: false,
          includeName: true
        }),
        {
          type: 'kronos-step-passthrough',
          description:
            "This step just passes all requests from its 'in' endpoint to its 'out' endpoint.",
          name: 'myPassThrough',
          endpoints: {
            in: {
              in: true
            },
            out: {
              out: true
            }
          }
        }
      );
      return Promise.resolve();
    });
  });

  it('Send a messsage throug the step', () => {
    return managerPromise.then(manager => {
      const stepBase = manager.createStepInstanceFromConfig(
        {
          type: 'kronos-step-passthrough',
          name: 'myPassThrough'
        },
        manager
      );

      const msgToSend = createMessage({
        file_name: 'anyFile.txt'
      });

      msgToSend.payload = {
        name: 'pay load'
      };

      let inEndPoint = stepBase.endpoints.in;
      let outEndPoint = stepBase.endpoints.out;

      // This endpoint is the IN endpoint of the next step.
      // It will be connected with the OUT endpoint of the Adpater
      const receiveEndpoint = new endpoint.ReceiveEndpoint('testEndpointIn');

      // This endpoint is the OUT endpoint of the previous step.
      // It will be connected with the OUT endpoint of the Adpater
      const sendEndpoint = new endpoint.SendEndpoint('testEndpointOut');

      receiveEndpoint.receive = message => {
        // the received message should equal the sended one
        // before comparing delete the hops
        message.hops = [];

        assert.deepEqual(message, msgToSend);
        return Promise.resolve();
      };

      outEndPoint.connected = receiveEndpoint;
      sendEndpoint.connected = inEndPoint;

      return stepBase.start().then(step => sendEndpoint.receive(msgToSend));
    });
  });
});
*/
