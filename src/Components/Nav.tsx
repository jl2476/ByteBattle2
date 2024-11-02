import './index.css';

const Nav = () => {
  return (
    <>
      <div>
        <div className="container1">
          <p>ByteBattle</p>
          <div className='container2'>
            <a href="/" className=" home">
            <img src='/home.svg'></img>
              Home
            </a>
            <a href="/puzzle" className=" ">
              Puzzle
            </a>
          </div>
          <div className='container3'>
            <img src='/profile.svg'></img>
            Sign in/Register
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
