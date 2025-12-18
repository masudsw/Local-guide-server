-- CreateTable
CREATE TABLE "specilities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "specilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_specilities" (
    "specilitiesId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,

    CONSTRAINT "doctor_specilities_pkey" PRIMARY KEY ("specilitiesId","doctorId")
);

-- AddForeignKey
ALTER TABLE "doctor_specilities" ADD CONSTRAINT "doctor_specilities_specilitiesId_fkey" FOREIGN KEY ("specilitiesId") REFERENCES "specilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specilities" ADD CONSTRAINT "doctor_specilities_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
