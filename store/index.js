export const state = () => ({
  adminMode: false,
  campType: "",
  campCode: "",
  startDate: "",
  endDate: "",
  period_note:'',
  summary: "",
  getMethod: "",
  ref: "",
  refURL: "",
  benefits: [],
  conditions: [],
  remarks: "",
})

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
    state.ref = details.ref;
    state.refURL = details.refURL;
  },
  setConditions(state, conditions) {
    state.conditions = conditions.conditions;
    state.benefits = conditions.benefits;
    state.remarks = conditions.remarks;
  },
  setAdminMode(state) {
    state.adminMode = true;
  }
}
