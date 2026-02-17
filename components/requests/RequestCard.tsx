"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PartnerRequest } from "@/lib/api/partner-requests";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Calendar, MapPin, Users, DollarSign } from "lucide-react";

interface RequestCardProps {
  request: PartnerRequest;
  type: "received" | "sent";
  onAccept?: (requestId: string) => Promise<void>;
  onReject?: (requestId: string) => Promise<void>;
  onCancel?: (requestId: string) => Promise<void>;
}

export function RequestCard({
  request,
  type,
  onAccept,
  onReject,
  onCancel,
}: RequestCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    if (!onAccept) return;
    setIsLoading(true);
    try {
      await onAccept(request._id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!onReject) return;
    if (!confirm("Are you sure you want to reject this request?")) return;
    
    setIsLoading(true);
    try {
      await onReject(request._id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!onCancel) return;
    if (!confirm("Are you sure you want to cancel this request?")) return;
    
    setIsLoading(true);
    try {
      await onCancel(request._id);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "accepted":
        return "default";
      case "rejected":
        return "destructive";
      case "cancelled":
        return "secondary";
      default:
        return "outline";
    }
  };

  const otherUser = type === "received" ? request.sender : request.receiver;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="flex flex-col">
        {/* Content */}
        <div className="flex flex-1 flex-col p-6">
          {/* Trip Info */}
          <div className="mb-4">
            <Link
              href={`/user/trips/${request.trip._id}`}
              className="text-xl font-semibold hover:text-blue-600 dark:hover:text-blue-400"
            >
              {request.trip.destination}
            </Link>
            
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{request.trip.destination}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(request.trip.startDate)} - {formatDate(request.trip.endDate)}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>₹{request.trip.budget.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Group Size: {request.trip.groupSize}</span>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <Avatar className="h-12 w-12">
              {otherUser.profileImage ? (
                <Image
                  src={otherUser.profileImage}
                  alt={otherUser.fullName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-lg font-semibold text-white">
                  {otherUser.fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </Avatar>
            
            <div className="flex-1">
              <p className="font-medium">
                {type === "received" ? "Request from:" : "Request to:"}
              </p>
              <Link
                href={`/user/profile/${otherUser._id}`}
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                {otherUser.fullName}
              </Link>
            </div>
            
            <div className="text-right text-xs text-gray-500">
              {formatDate(request.createdAt)}
            </div>
          </div>

          {/* Message */}
          {request.message && (
            <div className="mb-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Message:
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {request.message}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {request.status === "pending" && (
            <div className="mt-auto flex gap-3">
              {type === "received" ? (
                <>
                  <Button
                    onClick={handleAccept}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? "Processing..." : "Accept"}
                  </Button>
                  <Button
                    onClick={handleReject}
                    disabled={isLoading}
                    variant="outline"
                    className="flex-1"
                  >
                    {isLoading ? "Processing..." : "Reject"}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleCancel}
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1"
                >
                  {isLoading ? "Cancelling..." : "Cancel Request"}
                </Button>
              )}
            </div>
          )}

          {/* Status Message */}
          {request.status !== "pending" && (
            <div className="mt-auto">
              <p className="text-sm text-gray-500">
                {request.status === "accepted" && "This request has been accepted"}
                {request.status === "rejected" && "This request has been rejected"}
                {request.status === "cancelled" && "This request has been cancelled"}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
