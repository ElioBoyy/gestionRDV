import './App.css';
import { queryMaker } from '../utils/dbConnection';

function App() {

  const handleClick = () => {
    queryMaker('api/users/all', 'GET', null)?.then((res) => { console.log(res.data) });
  }

  return (
    <>
      <div className='bg-darkGray w-full absolute top-1/2 left-0 z-0'>
        <button onClick={handleClick}></button>
      </div>
    </>
  );
}

export default App;
