-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "country" SET DEFAULT 'EG';

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "color" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'COD',
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "stripeSessionId" TEXT;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "color" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "colorVariants" JSONB,
ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "isHidden" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "manifactor" TEXT;

-- CreateTable
CREATE TABLE "HeroSection" (
    "id" SERIAL NOT NULL,
    "tagline" TEXT NOT NULL DEFAULT 'SanYou is not just Make-up or Skincare - it''s a feeling of elegance you can wear everyday',
    "buttonText" TEXT NOT NULL DEFAULT 'Shop Now',
    "buttonLink" TEXT NOT NULL DEFAULT '/products',
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSection_pkey" PRIMARY KEY ("id")
);
