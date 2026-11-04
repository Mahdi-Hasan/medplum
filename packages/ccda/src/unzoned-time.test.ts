// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import type { Composition } from '@medplum/fhirtypes';
import type { CcdaToFhirOptions } from './ccda-to-fhir';
import { convertCcdaToFhir } from './ccda-to-fhir';
import { convertXmlToCcda } from './xml';

describe('unzonedTime option', () => {
  function compositionDate(effectiveTime: string, options?: CcdaToFhirOptions): string | undefined {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ClinicalDocument xmlns="urn:hl7-org:v3">
  <title>Summary</title>
  <effectiveTime value="${effectiveTime}"/>
</ClinicalDocument>`;
    const bundle = convertCcdaToFhir(convertXmlToCcda(xml), options);
    return (bundle.entry?.[0]?.resource as Composition).date;
  }

  test('defaults to UTC for times without a zone', () => {
    expect(compositionDate('20240115093000')).toBe('2024-01-15T09:30:00Z');
  });

  test('keeps only the stated date when unzonedTime is date', () => {
    expect(compositionDate('20240115093000', { unzonedTime: 'date' })).toBe('2024-01-15');
  });

  test('keeps the stated zone when unzonedTime is date', () => {
    expect(compositionDate('20240115093000-0500', { unzonedTime: 'date' })).toBe('2024-01-15T09:30:00-05:00');
  });
});
