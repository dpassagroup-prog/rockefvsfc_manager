import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About ROCKEFVSFC</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Building champions on and off the field through excellence, discipline, and community.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-center">Our Mission</CardTitle>
            <CardDescription className="text-center">Developing Future Champions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              To provide a world-class football development program that nurtures talent, 
              builds character, and creates opportunities for young athletes to excel 
              both on and off the field.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Trophy className="w-8 h-8 text-secondary" />
            </div>
            <CardTitle className="text-center">Our Vision</CardTitle>
            <CardDescription className="text-center">Excellence in Every Aspect</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              To be recognized as the premier football development club in the region, 
              known for our commitment to excellence, sportsmanship, and community engagement.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-center">Our Values</CardTitle>
            <CardDescription className="text-center">Character First</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Integrity, discipline, teamwork, and respect form the foundation of everything 
              we do. We believe in developing not just better players, but better people.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">Our History</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Founded in 2015, ROCKEFVSFC has grown from a small local club to a 
              regional powerhouse in youth football development. Our journey has been 
              marked by dedication, hard work, and an unwavering commitment to our players.
            </p>
            <p>
              Over the years, we've produced numerous players who have gone on to play 
              at higher levels, including professional academies and university programs. 
              But more importantly, we've helped shape young individuals who carry our 
              values throughout their lives.
            </p>
            <p>
              Our state-of-the-art facilities, experienced coaching staff, and 
              comprehensive development programs set us apart as a club that truly 
              cares about the holistic development of our athletes.
            </p>
          </div>
        </div>
        <div>
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
            <p className="text-muted-foreground mb-6">
              Whether you're a player looking to develop your skills, a parent seeking 
              the best for your child, or a community member wanting to support local sports, 
              there's a place for you at ROCKEFVSFC.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Players Developed:</span>
                <span className="font-semibold">500+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Teams:</span>
                <span className="font-semibold">15+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Community Programs:</span>
                <span className="font-semibold">10+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}