import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Eye, Award, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            About EMS
          </h1>
          <p className="text-xl text-gray-600">
            Revolutionizing examination management for educational institutions
            worldwide
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card>
              <CardHeader>
                <Target className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  To empower educational institutions with cutting-edge
                  technology that simplifies examination management, reduces
                  administrative burden, and enhances the assessment experience
                  for students and educators alike. We strive to make online
                  examinations accessible, secure, and efficient for schools and
                  colleges of all sizes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Eye className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  To become the leading examination management platform
                  globally, transforming how educational institutions conduct
                  assessments. We envision a future where every student has
                  access to fair, secure, and convenient online examinations,
                  enabling educators to focus on what matters most - teaching
                  and student development.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Story Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Our Story
            </h2>
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
              <p className="text-gray-600 leading-relaxed mb-4">
                EMS was born from a simple observation: educational institutions
                were struggling with the complexity and inefficiency of
                traditional examination systems. Paper-based exams were
                time-consuming, resource-intensive, and prone to errors.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our founders, experienced educators and technologists, came
                together to create a solution that would address these
                challenges. They envisioned a platform that would not only
                digitize the examination process but also make it more secure,
                accessible, and insightful.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, EMS serves hundreds of educational institutions, helping
                them conduct thousands of examinations seamlessly. Our
                commitment to innovation, security, and user experience
                continues to drive us forward as we build the future of
                educational assessment.
              </p>
            </div>
          </div>

          {/* Values */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <Award className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>Excellence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We strive for excellence in everything we do, delivering
                    high-quality solutions that exceed expectations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>Integrity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We maintain the highest standards of integrity, ensuring
                    security and fairness in all examinations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Target className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We continuously innovate, adopting the latest technologies
                    to improve the examination experience.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Eye className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>Accessibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We believe in making quality education assessment accessible
                    to all institutions, regardless of size.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            EMS By The Numbers
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Institutions</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100K+</div>
              <div className="text-blue-100">Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-blue-100">Exams Conducted</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
