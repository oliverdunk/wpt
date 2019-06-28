// META: script=/resources/testharness.js
// META: script=/resources/testharnessreport.js
// META: script=/resources/testdriver.js
// META: script=/resources/testdriver-vendor.js
// META: script=/bluetooth/resources/bluetooth-helpers.js
'use strict';
const test_desc = 'Add multiple event listeners then readValue().';

bluetooth_test(async () => {
  let {characteristic, fake_characteristic} =
      await getMeasurementIntervalCharacteristic();
  await fake_characteristic.setNextReadResponse(GATT_SUCCESS, [0, 1, 2]);
  let results = await assert_promise_resolves_after_event(
      characteristic, 'readValue', 'characteristicvaluechanged',
      3 /* num_listeners */);
  let read_value = new Uint8Array(results[0].buffer);
  let event_values = results.slice(1).map(v => new Uint8Array(v.buffer));
  for (let event_value of event_values) {
    assert_equals(event_value.buffer, read_value.buffer);
    assert_array_equals(event_value, read_value);
  }
}, test_desc);
