import style from './style.scss';

const TestComponent: React.FunctionComponent = () => (
  <div styleName="testClassName">
    {JSON.stringify(style)}
  </div>
);

export default TestComponent;
