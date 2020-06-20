import './index.scss'
import Link from 'next/link'
import { connect } from 'react-redux'

const Detail = ((props) => {

    const { business, user } = props

    return (
        <div className="BusinessDetail_MainContainer">
            <div className="col1">
                {(business.owner == user.id)
                    &&
                    <Link href={`/business/${business.id}/edit`}>
                        <a>Edit</a>
                    </Link>
                }
                <div className="coverImage"></div>
                <div className="contactInfo_Container">
                    <p>Telf</p>
                    <p>Email</p>
                    <p>Instagram</p>
                    <p>Facebook</p>
                </div>
            </div>
            <div className="col2">
                <div className="titleAndFavSection_Container">
                    <h2>{business.name}</h2>
                    <p> Location Icon </p>
                    <div className="titleIcons">
                        <p>200</p>
                        <img className="BusinessDetailLikeIcon" src={require('../../img/feastey_likeIcon.png')} />
                        <img className="BusinessDetailFavIcon" src={require('../../img/feastey_favoriteIcon.png')} />
                    </div>
                </div>
                <p>{business.location}</p>
                <p>Bussiness Description</p>
                <div className="section_Container">
                    <h2>Section Title</h2>
                    <div className="file_Container">
                        <h3>File</h3>
                    </div>
                </div>
                <div className="gallery_Container">
                    <div>
                        <h2>Gallery Component</h2>
                    </div>
                </div>
            </div>
        </div>
    )
})

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}
export default connect((state => state), mapDispatchToProps)(Detail)
