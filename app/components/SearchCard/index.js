import './index.scss'
import Link from 'next/link'

export default ((props) => {
    return (
        <div className="searchCard_Container">
            <div className="searchCard_imgContainer">
                <Link href="/detail">
                    <a>
                        <div className="searchCard_img"></div>
                    </a>
                </Link>
            </div>
            <div className=" searchCard_infoContainer">
                <div className="searchCard_infoContainer_Header">
                    <Link href="/detail">
                        <a>
                            <h2>Bussines Title</h2>
                        </a>
                    </Link>
                    <div className="favorite_Container">
                        <img className="favoriteIconCard" src={require('../../img/feastey_favoriteIcon.png')}></img>
                    </div>
                </div>
                <p>Adress</p>
                <p className="searchCard_infoContainer_Description">Bussines description</p>
                <div className="cardFooter">
                    <p>Category</p>
                    <div className="likesContainer">
                        <p>200</p>

                        <img className="likesIconCard" src={require("../../img/feastey_likeIcon.png")}></img>

                    </div>

                </div>
            </div>

        </div>
    )
})