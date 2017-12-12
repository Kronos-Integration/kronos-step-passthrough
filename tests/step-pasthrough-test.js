import test from 'ava';
import { PassthroughStep } from '../src/step-passthrough';
import { SendEndpoint, ReceiveEndpoint } from 'kronos-endpoint';

test('step-passthrough static', t => {
  const owner = { emit() {} };
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
      includeConfig: false,
      includeName: true
    }),
    {
      type: 'kronos-step-passthrough',
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
});

test('step-passthrough dynamic', async t => {
  const owner = { emit() {} };
  const step = new PassthroughStep(
    {
      type: 'kronos-step-passthrough',
      name: 'myPassThrough'
    },
    owner
  );

  const sendEndpoint = new SendEndpoint('testEndpointOut');
  sendEndpoint.connected = step.endpoints.in;

  const receiveEndpoint = new ReceiveEndpoint('testEndpointIn');
  step.endpoints.out.connected = receiveEndpoint;

  await step.start();

  t.is(step.state, 'running');

  receiveEndpoint.receive = async message => `${message} echo`;

  const result = await sendEndpoint.receive('hello');
  t.is(result, 'hello echo');
});
