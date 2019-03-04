import {decodeTsRecord, asServingReqRes} from './reqstore_format';

fdescribe('Yoyoyo', () => {

  const data =
    `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`;

  it('zzzz', () => {
    const bytes = decodeBase64(data);
    const wtf = decodeTsRecord(bytes);

    const descrR = [];
    wtf.forEach(function(v) {
      const descrE = [];
      v.entries.forEach(function(x) {
        const reqRes = asServingReqRes(x.data);
        const reqS = JSON.stringify(reqRes.req.toJSON());
        const respS = JSON.stringify(reqRes.resp.toJSON());

        descrE.push(`\tEntry:${x.uid}`);
        descrE.push(`\t\tReq:${reqS}`);
        descrE.push(`\t\tResp:${respS}`);

      });
      const joined = descrE.join('\n');
      descrR.push(`Record:${v.ts}\n${joined}`);
    });
    const finalDescr = descrR.join('\n');
    console.log(finalDescr);
  });
});

function decodeBase64(input: string): Uint8Array {
  debugger;
  const raw = window.atob(input);

  const rawLength = raw.length;

  const array = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}
