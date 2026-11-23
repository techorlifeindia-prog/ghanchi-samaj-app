// [GSA-LOC-F-CM-01: Shared Datalists Component for Location Inputs]
import React from 'react';
import { VILLAGE_OPTIONS, DISTRICT_OPTIONS, STATE_OPTIONS, CITY_OPTIONS } from '../../data/locationGotraData';

interface LocationDatalistsProps {
  prefix: string;
  language: 'hi' | 'en';
}

export const LocationDatalists: React.FC<LocationDatalistsProps> = ({ prefix, language }) => {
  const villages = language === 'hi' ? VILLAGE_OPTIONS.hi : VILLAGE_OPTIONS.en;
  const districts = language === 'hi' ? DISTRICT_OPTIONS.hi : DISTRICT_OPTIONS.en;
  const states = language === 'hi' ? STATE_OPTIONS.hi : STATE_OPTIONS.en;
  const cities = language === 'hi' ? CITY_OPTIONS.hi : CITY_OPTIONS.en;

  return (
    <>
      <datalist id={`${prefix}-village-options`}>
        {villages.map(v => <option key={v} value={v} />)}
      </datalist>

      <datalist id={`${prefix}-district-options`}>
        {districts.map(d => <option key={d} value={d} />)}
      </datalist>

      <datalist id={`${prefix}-state-options`}>
        {states.map(s => <option key={s} value={s} />)}
      </datalist>

      <datalist id={`${prefix}-city-options`}>
        {cities.map(c => <option key={c} value={c} />)}
      </datalist>
    </>
  );
};
