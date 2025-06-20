"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { toast } from "@/hooks/use-toast"

export default function ProviderApplicationPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("profile")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Application submitted",
      description: "Your provider application has been submitted successfully.",
    })

    setIsSubmitting(false)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Provider Application"
        description="Complete your provider profile to join the PMCare network"
      />

      <form onSubmit={handleSubmit}>
        <div className="flex gap-6">
          <div className="w-64 shrink-0">
            <div className="space-y-1">
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("profile")}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  1
                </div>
                Profile
              </Button>
              <Button
                variant={activeTab === "payment" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("payment")}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  2
                </div>
                Payment
              </Button>
              <Button
                variant={activeTab === "charges" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("charges")}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  3
                </div>
                Charges
              </Button>
              <Button
                variant={activeTab === "capabilities" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("capabilities")}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  4
                </div>
                Capabilities
              </Button>
              <Button
                variant={activeTab === "experience" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("experience")}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  5
                </div>
                Experience
              </Button>
              <Button
                variant={activeTab === "personnel" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("personnel")}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  6
                </div>
                Personnel
              </Button>
              <Button
                variant={activeTab === "contract" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("contract")}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  7
                </div>
                Contract
              </Button>
              <Button
                variant={activeTab === "advertisement" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("advertisement")}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  8
                </div>
                Advertisement
              </Button>
              <Button
                variant={activeTab === "document" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("document")}
                type="button"
              >
                <div className="bg-gray-400 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  9
                </div>
                Document
              </Button>
            </div>
          </div>

          <div className="flex-1">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="provider-name">Provider Name (As per Borang B/F)</Label>
                        <Input id="provider-name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="provider-alias">Provider Alias</Label>
                        <Input id="provider-alias" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea id="address" required />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kuala-lumpur">Kuala Lumpur</SelectItem>
                            <SelectItem value="selangor">Selangor</SelectItem>
                            <SelectItem value="penang">Penang</SelectItem>
                            <SelectItem value="johor">Johor</SelectItem>
                            <SelectItem value="sabah">Sabah</SelectItem>
                            <SelectItem value="sarawak">Sarawak</SelectItem>
                            {/* Add other Malaysian states */}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postcode">Postcode</Label>
                        <Input id="postcode" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">GPS Coordinates - Latitude</Label>
                        <Input id="latitude" type="number" step="0.000001" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">GPS Coordinates - Longitude</Label>
                        <Input id="longitude" type="number" step="0.000001" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tel-number">Provider Tel Number</Label>
                        <Input id="tel-number" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fax-number">Provider Fax No</Label>
                        <Input id="fax-number" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mobile-phone">Mobile Phone No</Label>
                        <Input id="mobile-phone" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp">Phone WhatsApp</Label>
                        <Input id="whatsapp" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" type="url" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="proprietor">Proprietor</Label>
                        <Input id="proprietor" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="passport">Passport No (For Non Malaysian Citizen Only)</Label>
                        <Input id="passport" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Registration & Compliance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-reg-no">Company Registration No</Label>
                        <Input id="company-reg-no" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gst-reg">GST Registration</Label>
                        <Input id="gst-reg" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tin-no">TIN No</Label>
                        <Input id="tin-no" required />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Classification & Services</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="provider-type">Provider Type</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="clinic">Clinic</SelectItem>
                            <SelectItem value="hospital">Hospital</SelectItem>
                            <SelectItem value="specialist">Specialist</SelectItem>
                            <SelectItem value="dental">Dental</SelectItem>
                            <SelectItem value="pharmacy">Pharmacy</SelectItem>
                            <SelectItem value="laboratory">Laboratory</SelectItem>
                            <SelectItem value="wellness">Wellness Center</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="gl-issuance" />
                          <Label htmlFor="gl-issuance">Eligibility for GL Issuance?</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="provider-category">Provider Category</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary-care">Primary Care</SelectItem>
                          <SelectItem value="secondary-care">Secondary Care</SelectItem>
                          <SelectItem value="tertiary-care">Tertiary Care</SelectItem>
                          <SelectItem value="specialized-care">Specialized Care</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Panel & Service Eligibility</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="ame-panel" />
                          <Label htmlFor="ame-panel">AME Panel?</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="perkeso-panel" />
                          <Label htmlFor="perkeso-panel">PERKESO Panel?</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="panel-group" />
                          <Label htmlFor="panel-group">Panel Group</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Admission & Payment Policies</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="impose-deposit" />
                        <Label htmlFor="impose-deposit">Impose deposit for admission?</Label>
                      </div>
                      <div className="pl-6 pt-2">
                        <Label htmlFor="deposit-amount">RM</Label>
                        <Input id="deposit-amount" type="number" step="0.01" className="w-32" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="corporate-discount" />
                        <Label htmlFor="corporate-discount">Corporate Discount?</Label>
                      </div>
                      <div className="pl-6 pt-2 space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="discount-category">Category</Label>
                            <Input id="discount-category" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="discount-item">Item</Label>
                            <Input id="discount-item" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="discount-percentage">Discount (%)</Label>
                            <Input id="discount-percentage" type="number" min="0" max="100" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="discount-remarks">Remarks</Label>
                            <Input id="discount-remarks" />
                          </div>
                        </div>
                        <Button type="button" variant="outline">
                          Add Discount
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Operational Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="operating-hours">Operating Hours</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24-hours">24 Hours</SelectItem>
                          <SelectItem value="regular-hours">Regular Hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Regular Hours</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="weekday-hours">Monday - Friday</Label>
                          <div className="flex items-center space-x-2">
                            <Input id="weekday-start" type="time" className="w-32" />
                            <span>to</span>
                            <Input id="weekday-end" type="time" className="w-32" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weekend-hours">Saturday - Sunday</Label>
                          <div className="flex items-center space-x-2">
                            <Input id="weekend-start" type="time" className="w-32" />
                            <span>to</span>
                            <Input id="weekend-end" type="time" className="w-32" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="additional-hours" />
                        <Label htmlFor="additional-hours">Additional Hours Information</Label>
                      </div>
                      <div className="pl-6 pt-2 space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="monday-hours">Monday</Label>
                            <div className="flex items-center space-x-2">
                              <Input id="monday-start" type="time" className="w-32" />
                              <span>to</span>
                              <Input id="monday-end" type="time" className="w-32" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tuesday-hours">Tuesday</Label>
                            <div className="flex items-center space-x-2">
                              <Input id="tuesday-start" type="time" className="w-32" />
                              <span>to</span>
                              <Input id="tuesday-end" type="time" className="w-32" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="wednesday-hours">Wednesday</Label>
                            <div className="flex items-center space-x-2">
                              <Input id="wednesday-start" type="time" className="w-32" />
                              <span>to</span>
                              <Input id="wednesday-end" type="time" className="w-32" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="thursday-hours">Thursday</Label>
                            <div className="flex items-center space-x-2">
                              <Input id="thursday-start" type="time" className="w-32" />
                              <span>to</span>
                              <Input id="thursday-end" type="time" className="w-32" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="friday-hours">Friday</Label>
                            <div className="flex items-center space-x-2">
                              <Input id="friday-start" type="time" className="w-32" />
                              <span>to</span>
                              <Input id="friday-end" type="time" className="w-32" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="saturday-hours">Saturday</Label>
                            <div className="flex items-center space-x-2">
                              <Input id="saturday-start" type="time" className="w-32" />
                              <span>to</span>
                              <Input id="saturday-end" type="time" className="w-32" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sunday-hours">Sunday</Label>
                            <div className="flex items-center space-x-2">
                              <Input id="sunday-start" type="time" className="w-32" />
                              <span>to</span>
                              <Input id="sunday-end" type="time" className="w-32" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="holiday-hours">Public Holiday</Label>
                            <div className="flex items-center space-x-2">
                              <Input id="holiday-start" type="time" className="w-32" />
                              <span>to</span>
                              <Input id="holiday-end" type="time" className="w-32" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Other tabs would be implemented similarly */}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <div className="space-x-4">
            <Button type="button" variant="outline">
              Previous
            </Button>
            <Button type="button">Next</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
