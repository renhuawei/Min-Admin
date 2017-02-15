import * as EntryService from '../../services/Inventory/Entry';

export default {
  namespace: 'Inventory/Entry',
  state: {
    IinventH: [],
    pagination: {
      current: 1,
      total: 0,
      pageSize: 10,
    },
    query: [{
      BILL_NO: null,
      WRITER: null,
      StartDate: null,
      EndDate: null,
    }],
  },
  effects: {
    *fetch({}, { select, call, put }){
      const pagination = yield select(state => state['Inventory/Entry'].pagination);
      const query = yield select(state => state['Inventory/Entry'].query);
      const res = yield call(EntryService.getEntry, { ...pagination, query });
      if (res.data.success) {
        yield put({
          type: 'fetchData',
          payload: res.data.data,
        })
      }
    },
  },
  reducers: {
    fetchData(state, action){
      return {
        ...state,
        IinventH: action.payload.IinventH,
        pagination: { ...state.pagination, total: action.payload.total },
      }
    },
    changePage(state, action){
      const { current, pageSize } = action.payload;
      return {
        ...state,
        pagination: { ...state.pagination, current: current, pageSize: pageSize },
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }){
      history.listen(({ pathname }) => {
          if (pathname==='/inventory/entry') {
            dispatch({
              type: 'fetch',
            });
          }
        }
      )
    }
  },
};
