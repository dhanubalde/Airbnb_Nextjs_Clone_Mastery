"use client"

import { SafeUser, safeListing } from "@/app/types";
import useCountries from "@/hooks/useCountries";
import { Listing, Reservation} from "@prisma/client"
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns"
import Image from "next/image";
import HeartButton from "../HeartButton";
import { TbCurrencyPeso } from "react-icons/tb";
import Button from "../Button";

interface CardProps { 
    data: safeListing;
    reservation?: Reservation;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: SafeUser | null;
}

const ListingCard: React.FC<CardProps> = ({ 
    data,
    reservation,
    onAction,
    disabled,
    actionLabel,
    actionId = "",
    currentUser
}) => {
    const router = useRouter();
    const { getByValue } = useCountries();
    const location = getByValue(data.locationValue);

  const handleCancel = useCallback((
    e: React.MouseEvent<HTMLButtonElement>
  ) => { 
    e.stopPropagation();

    if (disabled) { 
      return;
    }
    onAction?.(actionId);
  },[onAction, actionId, disabled])


  const price = useMemo(() => { 
    if (reservation) { 
      return reservation.totalPrice
    }
    return data.price;
  }, [reservation, data.price])
  

  const reservationDate = useMemo(() => { 
    if (!reservation) { 
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, 'PP')} - ${format(end, 'PP')}`;
  }, [reservation])
  



    return (
      <div
        onClick={() => router.push(`/listings/${data.id}`)}
        className="
          col-span-1 cursor-pointer group
        ">
        <div className="flex flex-col gap-2 w-full">
          <div className="
            aspect-square w-full relative overflow-hidden rounded-xl bg-[#8CEAFF]
          ">
            <Image
              fill
              alt="listing"
              src={data.imageSrc}
              className="object-cover h-full w-full group-hover:scale-110 transition"
            />

            <div className="absolute top-3 right-3">
              <HeartButton
                listingId={data.id}
                currentUser={currentUser}
              />
            </div>
          </div>
          
          <div className="font-semibold text-lg">
            {location?.region}, { location?.label}
          </div>
          <div className="font-light text-neutral-500">
            {reservationDate || data.category}
          </div>


          <div className="flex flex-row items-center gap-2">
           
            <div className="font-semibold flex flex-row items-center">
            <TbCurrencyPeso />{price}
            </div>
            {!reservation && (
              <div className="font-semibold bg-[#8CEAFF] px-2 rounded-3xl text-[#1DA2BF] text-[12px]">
                night
              </div>
            )}
          </div>

          {onAction && actionLabel && (
            <Button
              disabled={disabled}
              small
              label={actionLabel}
              onClick={handleCancel}
            />
          )}
        </div>
    </div>
  )
}

export default ListingCard