{
  /* 
  Authors: 
  - Le Luu Phuoc Thinh
  - Nguyen Thi Thanh Minh
  - Nguyen Quy Hung
  - Vo Thi Kim Huyen
  - Dinh Danh Nam

  Group 3 - COS30049
*/
}

const AppHeader = ({ title, description }) => {
  return (
    <header className="bg-gradient-to-r from-blue-100 to-blue-300 text-white shadow-xl">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight text-blue-900 text-center">
          {title}
        </h1>
        <p className="text-xl mt-4 text-center text-blue-800 max-w-2xl mx-auto">
          {description}
        </p>
      </div>
    </header>
  );
};

export default AppHeader;
