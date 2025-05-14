
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Bell, BarChart, FileCheck, Users, Gauge, Briefcase } from "lucide-react";

const Index = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dritu Enterprise</h1>
        <p className="text-gray-500 mt-1">Business Management Dashboard</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Quotations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active AMCs</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">+3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Tenders</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">-3% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <FileText size={18} />
              </div>
              <div>
                <p className="font-medium">New quotation generated</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Briefcase size={18} />
              </div>
              <div>
                <p className="font-medium">Tender application submitted</p>
                <p className="text-sm text-gray-500">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Users size={18} />
              </div>
              <div>
                <p className="font-medium">New client company added</p>
                <p className="text-sm text-gray-500">2 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tender Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Tenders</span>
                <span>36</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Won</span>
                <span className="text-green-600">24 (67%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Lost</span>
                <span className="text-red-600">12 (33%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Pending EMD Returns</span>
                <span>5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Pending Security Returns</span>
                <span>3</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming AMC Renewals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">ABC Corporation</p>
                  <p className="text-sm text-gray-500">Network Equipment</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-amber-600">15 May 2025</p>
                  <p className="text-sm text-gray-500">3 days left</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">XYZ Enterprises</p>
                  <p className="text-sm text-gray-500">Server Infrastructure</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-amber-600">22 May 2025</p>
                  <p className="text-sm text-gray-500">10 days left</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Global Tech</p>
                  <p className="text-sm text-gray-500">Security Systems</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">2 Jun 2025</p>
                  <p className="text-sm text-gray-500">21 days left</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
