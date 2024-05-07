import { CarouselUI } from "../../components/home/carousel"
import { LatestInStock } from "../../components/home/latestInStock"
import { Review } from "../../components/home/review"
import { ShopBrands } from "../../components/home/shopBrands"
import { ShortAbout } from "../../components/home/shortAbout"

const Home = () => {

    return <div>
        <CarouselUI />
        <div className="mt-2 xs:p-4 sm:p-6 lg:px-8">
            <LatestInStock />
        </div>
        <div className="mt-2">
            <ShopBrands />
        </div>
        <div className="mt-2 xs:p-4 sm:p-6 lg:px-8">
            <ShortAbout />
        </div>
        <div className="mt-2 xs:p-4 sm:p-6 lg:px-8">
            <Review />
        </div>
    </div>
}

export default Home
