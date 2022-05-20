export const state = () => ({
  adminMode: false,
  campType: '',
  campCode: '',
  startDate: '',
  endDate: '',
  period_note: '',
  summary: '',
  getMethod: '',
  refs: [],
  benefits: [],
  conditions: [],
  remarks: '',
  isDisplay: null,
});

export const mutations = {
  setCampInfo(state, campInfo) {
    state.campType = campInfo.type;
    state.campCode = campInfo.code;
    state.startDate = campInfo.startDate;
    state.endDate = campInfo.endDate;
    state.period_note = campInfo.period_note;
  },
  setDetails(state, details) {
    state.summary = details.summary;
    state.getMethod = details.getMethod;
    state.refs = details.refs;
  },
  setConditions(state, conditions) {
    state.conditions = conditions.conditions;
    state.benefits = conditions.benefits;
    state.remarks = conditions.remarks;
    state.isDisplay = conditions.isDisplay;
  },
  setAdminMode(state) {
    state.adminMode = true;
  },
};
