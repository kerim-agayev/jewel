-- CreateEnum
CREATE TYPE "PriceUpdateMode" AS ENUM ('AUTOMATIC', 'MANUAL');

-- CreateEnum
CREATE TYPE "MetalType" AS ENUM ('YELLOW_GOLD', 'WHITE_GOLD', 'ROSE_GOLD', 'PLATINUM', 'SILVER', 'GOLD_PLATED_SILVER', 'STEEL', 'BIJOUTERIE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'KIDS', 'UNISEX');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('NEW', 'USED');

-- CreateEnum
CREATE TYPE "PricingMode" AS ENUM ('WEIGHT_BASED', 'FIXED');

-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('ADMIN', 'SALES_REP');

-- CreateEnum
CREATE TYPE "LeadChannel" AS ENUM ('WHATSAPP', 'PHONE', 'INSTAGRAM');

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "instagram" TEXT,
    "priceUpdateMode" "PriceUpdateMode" NOT NULL DEFAULT 'AUTOMATIC',
    "appliedGoldPriceSnapshotId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameAz" TEXT NOT NULL,
    "nameRu" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "titleAz" TEXT NOT NULL,
    "titleRu" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "pricingMode" "PricingMode" NOT NULL DEFAULT 'WEIGHT_BASED',
    "metalType" "MetalType" NOT NULL,
    "purity" INTEGER,
    "weightGrams" DECIMAL(65,30),
    "fixedPrice" DECIMAL(65,30),
    "priceOverride" DECIMAL(65,30),
    "stoneType" TEXT,
    "gender" "Gender",
    "status" "ProductStatus" NOT NULL,
    "laborCostPercent" DECIMAL(65,30) NOT NULL DEFAULT 15,
    "laborCostFixed" DECIMAL(65,30),
    "stoneCost" DECIMAL(65,30) DEFAULT 0,
    "marginPercent" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "barterEligible" BOOLEAN NOT NULL DEFAULT true,
    "freeShipping" BOOLEAN NOT NULL DEFAULT true,
    "descriptionAz" TEXT,
    "descriptionRu" TEXT,
    "attributes" JSONB,
    "storeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altAz" TEXT NOT NULL,
    "altRu" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "StaffRole" NOT NULL DEFAULT 'SALES_REP',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "storeId" TEXT NOT NULL,
    "authUserId" TEXT,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "finalPrice" DECIMAL(65,30) NOT NULL,
    "goldPriceAtSale" DECIMAL(65,30),
    "isBarter" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "soldAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoldPriceSnapshot" (
    "id" TEXT NOT NULL,
    "pricePerGramAZN" DECIMAL(65,30) NOT NULL,
    "pricePerOunceUSD" DECIMAL(65,30) NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'gold-api.com',
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoldPriceSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactLead" (
    "id" TEXT NOT NULL,
    "productId" TEXT,
    "channel" "LeadChannel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StyleShot" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "altAz" TEXT NOT NULL,
    "altRu" TEXT NOT NULL,
    "isAIGenerated" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StyleShot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StyleShotProduct" (
    "styleShotId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "StyleShotProduct_pkey" PRIMARY KEY ("styleShotId","productId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_code_key" ON "Product"("code");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_metalType_idx" ON "Product"("metalType");

-- CreateIndex
CREATE INDEX "Product_purity_idx" ON "Product"("purity");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_authUserId_key" ON "Staff"("authUserId");

-- CreateIndex
CREATE INDEX "Sale_staffId_soldAt_idx" ON "Sale"("staffId", "soldAt");

-- CreateIndex
CREATE INDEX "Sale_soldAt_idx" ON "Sale"("soldAt");

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_appliedGoldPriceSnapshotId_fkey" FOREIGN KEY ("appliedGoldPriceSnapshotId") REFERENCES "GoldPriceSnapshot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactLead" ADD CONSTRAINT "ContactLead_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleShotProduct" ADD CONSTRAINT "StyleShotProduct_styleShotId_fkey" FOREIGN KEY ("styleShotId") REFERENCES "StyleShot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleShotProduct" ADD CONSTRAINT "StyleShotProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
