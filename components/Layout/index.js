import './index.scss'


export default ((props) => {
    return (
        <div className="app">
            <header className="header">
                <h1>FEASTEY</h1>
            </header>
            <div className="content-container">
                <div className="sidebar">
                    <ul>
                        <li>adsad</li>
                        <li>adsad</li>
                        <li>adsad</li>
                        <li>adsad</li>
                    </ul>
                </div>
                <div className="content">
                    {props.children}
                </div>
            </div>
        </div>
    )
})

