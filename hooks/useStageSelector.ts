import { useSelector } from 'react-redux';
import { RootReducer } from '../redux/reducers';

const useStageSelector = <T>(
  selector: (state: RootReducer) => T,
  equalityFn?: (left: T, right: T) => boolean
): T => useSelector<RootReducer, T>(selector, equalityFn);

export default useStageSelector;
