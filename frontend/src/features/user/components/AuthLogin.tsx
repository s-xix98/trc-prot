export const AuthLogin = ({
  displayName,  
  redirectUrl,
}:{
  displayName: string,
  redirectUrl: string,
}) => {

  const handleButtonClick = () => {
    window.location.href = redirectUrl;
  };

  return (
    <>
      <button onClick={handleButtonClick}>
        {displayName}
      </button>
    </>
    );
};