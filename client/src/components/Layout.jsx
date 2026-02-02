import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
                {children}
            </div>
        </>
    );
};

export default Layout;
